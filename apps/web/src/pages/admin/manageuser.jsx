import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc, setLogLevel } from 'firebase/firestore';
import { Edit3, Trash2, User, Loader2, X, AlertTriangle } from 'lucide-react';

// --- Global Firebase Configuration and Initialization ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-admin-app';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// The main App component will handle initialization
let db = null;
let auth = null;

// --- Helper Components ---

/**
 * Custom Modal for Edit/Profile View
 */
const UserModal = ({ user, onClose, onSave, mode, isSaving }) => {
  const [formData, setFormData] = useState(user || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isProfileView = mode === 'profile';

  const handleSave = () => {
    onSave(formData);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transition-all transform scale-100 opacity-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isProfileView ? 'User Profile' : 'Edit User'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {['displayName', 'email', 'role', 'phone', 'lastActive'].map(key => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </label>
              {isProfileView || key === 'lastActive' ? (
                <p className="mt-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  {formData[key] || 'N/A'}
                </p>
              ) : (
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  name={key}
                  id={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              )}
            </div>
          ))}
          <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
            User ID: <span className="font-mono text-xs">{formData.id}</span>
          </div>
        </div>

        {!isProfileView && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-150 flex items-center disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin mr-2" size={20} /> : <Edit3 size={20} className="mr-2" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Custom Confirmation Dialog
 */
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900 bg-opacity-70 backdrop-blur-sm p-4" onClick={onCancel}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm transition-all transform scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


/**
 * Main Admin User Management Component
 */
const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    user: null,
    mode: 'profile', // 'profile' or 'edit'
  });
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    userToDelete: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  // 1. Initialize Firebase and Auth
  useEffect(() => {
    try {
      if (Object.keys(firebaseConfig).length === 0) {
        throw new Error("Firebase configuration is missing.");
      }
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      setLogLevel('debug');

      const authenticate = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            // Fallback to anonymous sign-in if no token is provided
            await signInAnonymously(auth);
          }
        } catch (authError) {
          console.error("Firebase Auth Error:", authError);
          setError("Failed to authenticate with Firebase.");
        } finally {
          setIsAuthReady(true);
        }
      };

      authenticate();
    } catch (e) {
      console.error("Firebase Initialization Error:", e);
      setError(e.message);
      setLoading(false);
    }
  }, []);

  // 2. Fetch Users (Real-time with onSnapshot)
  useEffect(() => {
    if (!db || !isAuthReady) return;

    setLoading(true);
    setError(null);

    try {
      // Admin views public user profiles stored at /artifacts/{appId}/public/data/users
      const usersCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');

      const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
        const userList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastActive: doc.data().lastActive ? new Date(doc.data().lastActive.seconds * 1000).toLocaleString() : 'Never',
        }));
        setUsers(userList);
        setLoading(false);
      }, (err) => {
        console.error("Firestore Fetch Error:", err);
        setError("Failed to load user data from the database.");
        setLoading(false);
      });

      return () => unsubscribe(); // Cleanup listener on component unmount
    } catch (e) {
      console.error("User Fetch Setup Error:", e);
      setError("An unexpected error occurred during data setup.");
      setLoading(false);
    }
  }, [isAuthReady]);

  // --- CRUD Handlers ---

  const handleEdit = useCallback((user) => {
    setModalState({ isOpen: true, user, mode: 'edit' });
  }, []);

  const handleViewProfile = useCallback((user) => {
    setModalState({ isOpen: true, user, mode: 'profile' });
  }, []);

  const handleSave = async (updatedData) => {
    if (!db) {
      setError("Database connection not established.");
      return;
    }
    setIsSaving(true);
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', updatedData.id);
      // Only update fields that can be edited
      await updateDoc(userRef, {
        displayName: updatedData.displayName,
        email: updatedData.email,
        role: updatedData.role, // Admin can change roles
        phone: updatedData.phone,
      });
      setModalState(prev => ({ ...prev, isOpen: false, user: null }));
    } catch (e) {
      console.error("Error updating user:", e);
      setError("Failed to update user. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePrompt = (user) => {
    setConfirmState({
      isOpen: true,
      userToDelete: user,
    });
  };

  const handleDelete = async () => {
    if (!db || !confirmState.userToDelete) {
      setError("Database connection not established or no user selected.");
      setConfirmState({ isOpen: false, userToDelete: null });
      return;
    }

    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', confirmState.userToDelete.id);
      await deleteDoc(userRef);
      setConfirmState({ isOpen: false, userToDelete: null });
      // The onSnapshot listener will automatically update the UI
    } catch (e) {
      console.error("Error deleting user:", e);
      setError("Failed to delete user. Check console for details.");
      setConfirmState({ isOpen: false, userToDelete: null });
    }
  };

  // --- Render Logic ---

  if (loading && !isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-indigo-500 mr-2" size={32} />
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Establishing secure connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg dark:bg-red-900 dark:border-red-600 dark:text-red-200">
        <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm">Please check the console for more details and ensure Firebase is correctly configured.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 border-b pb-2 border-indigo-200 dark:border-indigo-800">
          Admin User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Manage all application user profiles. Data updates in real-time.
        </p>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-indigo-500 mr-2" size={24} />
            <span className="text-indigo-500">Loading users...</span>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <User size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No users found in the system.</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['Name', 'Email', 'Role', 'Last Active', 'Actions'].map(header => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.displayName || 'Unnamed User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                          user.role === 'doctor' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}>
                          {user.role || 'patient'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          title="View Profile"
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-2 rounded-full hover:bg-indigo-50 transition"
                        >
                          <User size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          title="Edit User"
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200 p-2 rounded-full hover:bg-yellow-50 transition"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(user)}
                          title="Delete User"
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-2 rounded-full hover:bg-red-50 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Edit/Profile */}
      {modalState.isOpen && (
        <UserModal
          user={modalState.user}
          mode={modalState.mode}
          onClose={() => setModalState({ isOpen: false, user: null, mode: 'profile' })}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        message={`Are you sure you want to permanently delete user ${confirmState.userToDelete?.displayName || 'this user'}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmState({ isOpen: false, userToDelete: null })}
      />
    </div>
  );
};

export default ManageUsersPage;

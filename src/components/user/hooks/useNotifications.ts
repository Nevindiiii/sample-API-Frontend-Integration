import toast from 'react-hot-toast';

export function useNotifications() {
  const showMessage = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') toast.success(msg);
    else toast.error(msg);
  };

  return { showMessage };
}
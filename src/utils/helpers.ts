import toast from 'react-hot-toast';

interface ToastData {
  type: 'success' | 'error' | 'info';
  message: string;
}

export function handleBackendToast(toastData?: ToastData) {
  if (!toastData) return;
  
  if (toastData.type === 'success') {
    toast.success(toastData.message);
  } else if (toastData.type === 'error') {
    toast.error(toastData.message);
  } else {
    toast(toastData.message);
  }
}

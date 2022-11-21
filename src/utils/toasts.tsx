import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ResetSvg } from '../icons';

export const loginErrorToast = () => {
  toast.remove();
  toast.error(
    (t) => (
      <>
        <span>You must log in!</span>
        <Link to="/login">
          <button className="toast-button">Log in</button>
        </Link>
        <button className="cancel-button" onClick={() => toast.dismiss(t.id)} />
      </>
    ),
    {
      duration: 3000,
    }
  );
};

export const dialogToast = (
  onClick: Function,
  message: string,
  buttonText: string
) => {
  toast.remove();
  toast.error(
    (t) => (
      <div>
        <span>{message}</span>
        <button
          className="toast-button"
          onClick={() => {
            onClick();
            toast.dismiss(t.id);
          }}
        >
          {buttonText}
        </button>
        <button className="cancel-button" onClick={() => toast.dismiss(t.id)} />
      </div>
    ),
    {
      duration: 5000,
      icon: '',
    }
  );
};

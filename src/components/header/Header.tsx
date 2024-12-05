import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './header.css';
import { useContext } from 'react';
import { ChatContext } from '../../context';

export const Header = () => {
  const context = useContext(ChatContext);
  return (
    <header>
      <div className="login-section">
        <div className="login-user">
          <FontAwesomeIcon icon={faUser} />
          <span className="login-user-name">{context?.user?.login || ''}</span>
        </div>
        <button className="login-btn">Log in</button>
      </div>
      <input
        type="text"
        placeholder="Search or start new chat"
        className="search-input"
      />
    </header>
  );
};
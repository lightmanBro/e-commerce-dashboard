import SearchOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationNoneOutlinedIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutline';
import ListOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import './Navbar.scss';

const Navbar = ({ user }) => {
//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   if (!user || !user.role) {
//     return null;
//   }

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon className="icon" />
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <NotificationNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <DarkModeOutlinedIcon className="icon" />
          </div>
          <div className="item">
            {/* <div className="name">
              {user.firstName ? user.firstName : user.email.split('@')[0]}
            </div>
            <div className="role">
              {user.role}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

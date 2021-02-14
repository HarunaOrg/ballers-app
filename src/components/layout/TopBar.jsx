import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link } from '@reach/router';
import { NotificationIcon, ThreeDotsIcon } from 'components/utils/Icons';
import ProfileAvatar from 'assets/img/avatar/profile.png';
import { UserContext } from 'context/UserContext';
import Image from 'components/utils/Image';

const Empty = React.forwardRef(({ children, onClick }, ref) => (
  <div className="top-nav-dropdown" onClick={onClick}>
    {children}
  </div>
));

const Header = () => {
  let { userState } = React.useContext(UserContext);
  const userName = `${userState.firstName} ${userState.lastName}`;
  const isCompanyLogo =
    !userState.profileImage && userState.vendor && userState.vendor.companyLogo;
  return (
    <>
      <Navbar
        fixed="top"
        className="dashboard-top-nav d-flex align-items-center"
        bg="transparent"
        expand="lg"
      >
        <div className="container-fluid">
          <Nav className="ml-auto d-flex flex-row align-items-center">
            <Nav.Link to="/login" as={Link}>
              <NotificationIcon />
            </Nav.Link>
            <Dropdown>
              <Dropdown.Toggle as={Empty} id="dropdown-basic">
                <Image
                  name={userName}
                  className={
                    isCompanyLogo
                      ? 'dashboard-top-nav__company-logo'
                      : 'dashboard-top-nav__avatar'
                  }
                  defaultImage={ProfileAvatar}
                  rounded
                  src={
                    isCompanyLogo
                      ? userState.vendor.companyLogo
                      : userState.profileImage
                  }
                  options={{ h: 200 }}
                />{' '}
                <ThreeDotsIcon />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-children">
                <Dropdown.Item as={Link} to="/user/settings">
                  Settings
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/logout">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* <Nav.Link as={Link} to="/register"></Nav.Link> */}
          </Nav>
        </div>
      </Navbar>
    </>
  );
};

export const isActive = ({ isCurrent }) => {
  return isCurrent ? { className: 'active font-weight-bold nav-link' } : null;
};

export default Header;

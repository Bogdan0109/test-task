import { useDispatch, useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';

import { SectionHeader } from './Header.styled';
// Icon for header
import Rectangle19 from '../../images/Rectangle19.svg';
import Rectangle20 from '../../images/Rectangle20.svg';
import Union from '../../images/Union.svg';
import Logout from '../../images/logout.svg';
import DefaultAvatar from '../../images/defaultAvatar.svg';

import { LogoWrapper } from './Header.styled';
import { Logo } from './Header.styled';
import { Logo2 } from './Header.styled';

import { LogoTitle } from './Header.styled';
import { AuthWrapper } from './Header.styled';
import { UserLogo } from './Header.styled';
import { LogOutIcon } from './Header.styled';
import { LogOutButton } from './Header.styled';
import { LogOutTitle } from './Header.styled';
import { UserTite } from './Header.styled';
import { logOut } from 'redux/auth/authOperations';
import { UniversalModal } from 'components/UniversalModal/UniversalModal';
import { useState } from 'react';

import { selectUser } from 'redux/auth/authSelectors';

// Mikhaylo Pobochikh
const modalQuestion = 'Do you really want to leave?';

export const Header = ({ isLoggedIn }) => {
  const [showModal, setShowModal] = useState(false);
  const user = useSelector(selectUser);

  console.log(isLoggedIn);
  const dispatch = useDispatch();
  const onHandleClick = () => {
    dispatch(logOut());
  };

  return (
    <header>
      <SectionHeader>
        <LogoWrapper>
          <Logo src={Rectangle19} alt="Logo" />
          <Logo2 src={Rectangle20} alt="Logo" />
          <LogoTitle src={Union} alt="Logo" />
        </LogoWrapper>
        {isLoggedIn && (
          <AuthWrapper>
            <UserLogo to="/avatar">
              <img src={user?.avatarURL ?? DefaultAvatar} alt="" width="32" />
            </UserLogo>
            <UserTite>{user?.email ?? 'User Name'}</UserTite>
            <LogOutButton type="button" onClick={() => setShowModal(true)}>
              <LogOutIcon src={Logout} alt="Logout icon" />
              <LogOutTitle>Exit</LogOutTitle>
            </LogOutButton>
          </AuthWrapper>
        )}
        {showModal && (
          <UniversalModal
            closeModal={setShowModal}
            agreeLogout={onHandleClick}
            question={modalQuestion}
          />
        )}
      </SectionHeader>
    </header>
  );
};

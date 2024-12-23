import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const loginRegProfile = ['/login', '/register', '/profile'];
  const feedPath = ['/feed'];
  const isPathActive = (pathArray: string[], currentPath: string) =>
    pathArray.some((route) => currentPath.startsWith(route));
  const loginRegProfileActive = isPathActive(
    loginRegProfile,
    location.pathname
  );
  const feedActive = isPathActive(feedPath, location.pathname);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to={'/'}
            className={`${styles.link} ${location.pathname === '/' ? styles.link_active : ''}`}
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to={'/feed'}
            className={`${styles.link} ${feedActive ? styles.link_active : ''}`}
          >
            <ListIcon type={feedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <Link
            to={'/profile'}
            className={`${styles.link} ${loginRegProfileActive ? styles.link_active : ''}`}
          >
            <ProfileIcon
              type={loginRegProfileActive ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};

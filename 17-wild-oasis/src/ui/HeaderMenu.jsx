import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import Logout from "../features/authentication/Logout";
import UserAvatar from "../features/authentication/UserAvatar";
import DarkModeToggle from "./DarkModeToggle";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  return (
    <StyledHeaderMenu>
      <li>
        <NavLink to="/account">
          <UserAvatar />
        </NavLink>
      </li>
      <li>
        <DarkModeToggle />
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;

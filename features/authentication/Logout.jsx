import ButtonIcon from "../../ui/ButtonIcon";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useLogout } from "./useLogout";
import SpinnerMini from "../../ui/SpinnerMini";

function Logout() {
  const { logout, isUnauthenticating } = useLogout();

  function handleClick() {
    logout();
  }

  return (
    <ButtonIcon
      onClick={handleClick}
      disabled={isUnauthenticating}
    >
      {isUnauthenticating ? (
        <SpinnerMini />
      ) : (
        <div>
          <span style={{ verticalAlign: "middle" }}>
            <HiArrowRightOnRectangle />
          </span>
          <span style={{ verticalAlign: "middle", martinTop: "3px" }}>
            {" "}
            LOG OUT
          </span>
        </div>
      )}
    </ButtonIcon>
  );
}

export default Logout;

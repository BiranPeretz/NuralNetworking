import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import userType from "../../types/user";
import { authenticateUser } from "../../store/userSlice";
import RectangleButton from "./RectangleButton";

type Props = {
	className?: string;
};

//form component of app's login. cradentials are email and password. successful submit either authenticate user and navigate to feed, or, change modal to CreateProfileForm if the user haven't created he's profile
const GuestLogin: React.FC<Props> = function ({ className }) {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function

	//form's submit function, sends login request to server and authenticates user or display encountered errors
	const guestLoginHandler = async function () {
		try {
			const cradentials = {
				email: import.meta.env.VITE_GUEST_USER_EMAIL,
				password: import.meta.env.VITE_GUEST_USER_PASSWORD,
			};

			//send login request
			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...cradentials }),
				}
			);

			const resultData = await result?.json(); //request's results data response
			//evaluate request's response status
			if (!(resultData?.status === "success")) {
				throw new Error(resultData.message);
			}

			//store JWT token in local storage
			localStorage.setItem("token", resultData?.token);

			//user's data initialization for store's state
			const user: userType = {
				_id: resultData?.data?.user?._id,
				email: resultData?.data?.user?.email,
				friendsList: [],
				groupsList: [],
				pagesList: [],
				friendRequestsList: [],
			};

			//if user have a profile, append its data
			user.fullName = resultData?.data?.user?.fullName;
			user.profilePicture = resultData?.data?.user?.profilePicture;
			user.about = resultData?.data?.user?.about;
			user.verifiedEmail = resultData?.data?.user?.verifiedEmail;

			//authenticate user with store's data ocject and navigate to Feed
			dispatch(authenticateUser(user));
			navigate("/feed");
		} catch (error) {
			console.log(error);
			//TODO: handle error
		}
	};

	return (
		<RectangleButton
			name="guest-login"
			onClick={guestLoginHandler}
			className={className}
			style={{ whiteSpace: "nowrap" }}
		>
			Guest Login
		</RectangleButton>
	);
};

export default GuestLogin;

import React from "react";
import classes from "./LoadingPage.module.css";
import { MoonLoader } from "react-spinners";

type Props = {
	children?: React.ReactNode;
};

const LoadingPage: React.FC<Props> = function (props) {
	return (
		<div className={classes.container}>
			<div className={`${classes.bot} ${classes.computing}`}>
				<div className={classes.head}>
					<div className={classes["left-ear"]}>
						<div className={classes["left-ear-inner"]}></div>
					</div>
					<div className={classes.face}>
						<div className={classes.eyes}>
							{/* <div className={classes["left-eye"]}></div> */}
							<MoonLoader
								size="50px"
								color="#fff"
								className={classes["left-eye"]}
							/>
							{/* <div className={classes["right-eye"]}></div> */}
							<MoonLoader
								size="50px"
								color="#fff"
								className={classes["right-eye"]}
							/>
						</div>
						<div className={classes.mouth}></div>
					</div>
					<div className={classes["right-ear"]}>
						<div className={classes["right-ear-inner"]}></div>
					</div>
				</div>
			</div>
			<h6 className={classes.text}>Loading...</h6>
		</div>
	);
};

export default LoadingPage;

import React, { forwardRef } from "react";
import { Slide } from "@mui/material";

const SlideTransition = (direction) => {
    const WrappedTransition = forwardRef(function Transition(props, ref) {
        // return <Slide direction={direction} ref={ref} {...props} />;
        return <Slide direction={direction} ref={ref} {...props} />
    });

    return WrappedTransition;
}
// add more below

export default SlideTransition;

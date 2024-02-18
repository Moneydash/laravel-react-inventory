import React, {Component} from 'react';
import * as Mui from '@mui/material';

export default class Notfound extends Component{
    constructor(props) {
        super(props);

        this.state = {
            color: '#787878'
        }
    }

    backToHome() {
        window.location = "/main/page";
        // localStorage.setItem('selectedIndex', 0);
    }

    render(){
        document.title = 'Page Not Found';
        return(
            <Mui.Container
                fixed
                align="center"
                justify="center"
                sx={{ mb:30, mt: 10 }}
            >
                <Mui.Typography
                    variant="h2"
                    component="div"
                    style={{ color: this.state.color }}
                >
                    404
                </Mui.Typography>
                <Mui.Typography
                    variant="h5"
                    component="div"
                    style={{ color: this.state.color, letterSpacing:'3px', marginInlineStart:'10px'}}
                >
                    PAGE NOT FOUND
                </Mui.Typography>
                <div style={{ marginTop: 10 }}></div>
                <Mui.Typography
                    variant="body2"
                    component="div"
                    style={{ color: this.state.color }}
                >
                The page you are looking for doesn't exist or another error occurred.
                </Mui.Typography>
                <Mui.Button variant="contained" onClick={this.backToHome} sx={{m:3}}>
                    Return to Homepage
                </Mui.Button>
            </Mui.Container>
        );
    }
}

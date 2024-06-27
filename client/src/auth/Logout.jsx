import { useContext, useEffect } from 'react';
import { AppInfoContext } from '../AppInfoModel';
import { useNavigate } from 'react-router-dom';
import API from '../request';

function Logout() {
    const navigator = useNavigate();
    const api = new API();
    const info = useContext(AppInfoContext);
    api.logOut().then((res) => {
            info.logout();
            navigator('/');
        
    });

}

export { Logout};
import { createContext } from 'react';

function AppInfo(){
    this.user = null;
    this.isLoggedIn = false;
    
    this.setUser = (user) => {
        this.user = user;
        this.isLoggedIn = true;
    };
    this.logout = () => {
        this.user = null;
        this.isLoggedIn = false;
    
    }
}

export const AppInfoContext = createContext(new AppInfo());
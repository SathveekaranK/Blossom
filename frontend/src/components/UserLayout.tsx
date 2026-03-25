import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.tsx';
import Footer from './Footer.tsx';

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-light selection:bg-primary/30 flex flex-col">
            <Navbar />
            <main className="pt-28 md:pt-32 flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;

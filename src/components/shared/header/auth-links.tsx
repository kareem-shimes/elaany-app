import { Link } from "react-router-dom";
import { buttonVariants } from "../../ui/button";
import LoginDialog from "../login-dialog";

interface AuthLinksProps {
  className?: string;
}

export default function AuthLinks({ className = "" }: AuthLinksProps) {
  return (
    <div className={`hidden lg:flex items-center gap-6 ${className}`}>
      <LoginDialog
        triggerText="دخول"
        triggerVariant="link"
        className="!text-lg !font-medium hover:text-primary transition-colors"
      />
      <Link
        to="/auth/signup"
        className={`${buttonVariants({
          size: "lg",
        })} !font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
      >
        انضم الان
      </Link>
    </div>
  );
}

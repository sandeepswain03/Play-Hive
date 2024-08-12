import { GiHoneycomb } from "react-icons/gi";
import { Link } from "react-router-dom";

function Logo({ size = "30" }) {
  return (
    <>
      <Link to="/" className="flex gap-2 items-center">
        <GiHoneycomb size={size} color="#FED800" />
        <span className="font-bold text-white">PlayHive</span>
      </Link>
    </>
  );
}

export default Logo;
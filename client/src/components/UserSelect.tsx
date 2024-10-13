import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";
import { Link } from "react-router-dom";

const UserSelect = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 ">
      <div className="flex flex-row border-2 border-gray-400 rounded-lg p-4 w-1/4 justify-between">
        <div>
          <h1 className="text-3xl mr-4 tracking-wide ">User</h1>
        </div>
        <div>
          <DropdownList style={{}} data={["Ken"]} className="" />
        </div>
      </div>
      <div className="mt-4">
        <Link
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          to="/dashboard"
        >
          Select
        </Link>
      </div>
    </div>
  );
};

export default UserSelect;

/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "./index.js";
import { IoCloseCircleOutline } from "./icons.js";

function SearchForSmallScreen({ open, setOpenSearch }) {
  //'open' A boolean indicating whether the search overlay is visible.
  //'setOpenSearch' A function that toggles the search overlay visibility.
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const search = (data) => {
    const query = data?.query;
    navigate(`/search/${query}`);
    setOpenSearch((prev) => !prev);
  };
  return (
    <>
      {open && (
        <div className="fixed bg-black bg-opacity-90 z-50 inset-0 h-screen w-full flex items-start justify-start">
          <div className="sm:p-8 p-4 relative w-full">
            <div className="absoulte top-5 right-5">
              <IoCloseCircleOutline
                size={30}
                onClick={() => setOpenSearch((prev) => !prev)}
              />
            </div>
            <form
              onSubmit={handleSubmit(search)}
              className="w-full flex items-center justify-center"
            >
              <Input
                type="text"
                placeholder="Search"
                className="px-4 py-2 border border-gray-300 focus:outline-none"
                {...register("query", { required: true })}
              />

              <Button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white font-semibold hover:bg-purle-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchForSmallScreen;

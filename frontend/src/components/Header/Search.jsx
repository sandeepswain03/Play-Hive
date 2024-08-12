import Input from "../index.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Search() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const search = (data) => {
    const query = data?.query;
    navigate(`/search/${query}`);
  };
  return (
    <>
      <form onSubmit={handleSubmit(search)}>
        <Input
          placeholder="Search"
          {...register("query", { required: true })}
        />
      </form>
    </>
  );
}

export default Search;

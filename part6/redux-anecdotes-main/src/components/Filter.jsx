import { useDispatch } from "react-redux";
import { changeText } from "../reducers/filterReducer";

const Filter = () => {
    const dispatch = useDispatch();

  const handleChange = (event) => {
    event.preventDefault();
    if(event.target.value){
        dispatch(changeText(event.target.value))
    }
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;

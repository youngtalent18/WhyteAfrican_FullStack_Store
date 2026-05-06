import { Link } from "react-router-dom";

const CategoryCard = ({ href, name, imageUrl }) => {
  return (
    <Link
      to={`/category/${href}`}
      className="block bg-white rounded-lg overflow-hidden hover:-translate-y-1 transition"
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-32 object-cover"
      />
      <div className="text-center text-slate-900 font-medium py-2 text-sm">
        {name}
      </div>
    </Link>
  );
};

export default CategoryCard;
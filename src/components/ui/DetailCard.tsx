interface DetailCardProps {
   title: string;
   value: string | number;
}

const DetailCard = ({ title, value }: DetailCardProps) => {
   return (
      <div className="detailCard">
         <div className="title text-secondary text-[0.8rem]">{title}</div>
         <div className="value text-[2rem] leading-8">{value}</div>
      </div>
   );
};

export default DetailCard;

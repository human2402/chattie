import { useEffect } from "react";
import { CiFileOn } from "react-icons/ci";

type Props = {
    url: string;
    type: string
  };
  
  function ImageBubble({ url, type}: Props) {
    const openInNewTab = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
      };
      

      useEffect(() => {
        console.log(url, type)
      }, []);
      if (type == 'file') {
        return (
          <div className="flex cursor-pointer">
            <CiFileOn className="h-[48px] w-10 mr-1 text-blue-500" />
            <div>
              <p className="text-blue-500 font-semibold">{url}</p>
              <p>1,2 МБ</p>
            </div>
          </div>
        )
      } 

    return (
      <div 
        className="flex justify-center items-center mt-1"
        style={{ width: '100%', height: '200px' }} // or any height you want
        onClick={openInNewTab}
      >
        <img 
          src={url} 
          alt="Отправленное изображение" 
          className="max-w-full max-h-full object-contain rounded-md" 
        />
      </div>
    );
  }
  
  export default ImageBubble;
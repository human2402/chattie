// import { useEffect } from "react";
// import { CiFileOn } from "react-icons/ci";

// type Props = {
//    file: any
//   };
  
//   function FileBubble({file}: Props) {
//     const openInNewTab = () => {
//         window.open(file.url, '_blank', 'noopener,noreferrer');
//       };
      

//       useEffect(() => {
//         console.log(file)
//       }, []);

//       if (file.type == 'file') {
//         return (
//           <div className="flex cursor-pointer">
//             <CiFileOn className="h-[48px] w-10 mr-1 text-blue-500" />
//             <div>
//               <p className="text-blue-500 font-semibold">{file.url}</p>
//               <p>1,2 МБ</p>
//             </div>
//           </div>
//         )
//       } 

//     return (
//       <div 
//         className="flex justify-center items-center mt-1"
//         style={{ width: '100%', height: '200px' }} // or any height you want
//         onClick={openInNewTab}
//       >
//         <img 
//           src={file.url} 
//           alt="Отправленное изображение" 
//           className="max-w-full max-h-full object-contain rounded-md" 
//         />
//       </div>
//     );
//   }
  
//   export default FileBubble;


import { useEffect } from "react";
import { CiFileOn } from "react-icons/ci";

type Props = {
  file: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
};

function FileBubble({ file }: Props) {
  if (!file || !file.url || !file.type) {
    return null; // or show a fallback
  }

  const openInNewTab = () => {
    window.open(file.url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    // console.log("Received file:", file);
  }, [file]);

  const isImage = file.type?.startsWith("image/");

  if (!file.url) return null;

  return isImage ? (
    <div 
      className="flex justify-center items-center mt-1 cursor-pointer"
      style={{ width: '100%', height: '200px' }}
      onClick={openInNewTab}
    >
      <img 
        src={file.url} 
        alt={file.name || "Отправленное изображение"} 
        className="max-w-full max-h-full object-contain rounded-md" 
      />
    </div>
  ) : (
    <div className="flex cursor-pointer items-center" onClick={openInNewTab}>
      <CiFileOn className="h-[48px] w-10 mr-2 text-blue-500" />
      <div>
        <p className="text-blue-500 font-semibold">{file.name || file.url}</p>
        <p>{(file.size / (1024 * 1024)).toFixed(1)} МБ</p>
      </div>
    </div>
  );
}

export default FileBubble;

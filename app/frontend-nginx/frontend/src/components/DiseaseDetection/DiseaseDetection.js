import { useState, useEffect, useRef } from "react";
import default_crop from "../../assets/images/DiseaseDetectionPage/crop.jpg";
import { axiosInstance } from "../../axios.config";
import { useTranslation, Trans } from "react-i18next";
import LoadingBar from "react-top-loading-bar";
import { BsSearch, BsDownload } from "react-icons/bs";
import html2pdf from "html2pdf.js";
import { IoReloadOutline } from "react-icons/io5";

const DiseaseDetection = () => {
  const { t, i18n } = useTranslation();

  const [imageUploaded, setUploadedImage] = useState();
  const [preview, setPreview] = useState(null);
  const [isPreview, setIsPreview] = useState();
  const [location, setLocation] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const ref = useRef();

  const drop = useRef(null);
  
  useEffect(() => {
    if (!imageUploaded) {
      setPreview(undefined);
      setIsPreview(false);
      return;
    }

    const objectUrl = URL.createObjectURL(imageUploaded);
    setPreview(objectUrl);
    setIsPreview(true);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageUploaded]);

  useEffect(() => {
    position();
  }, []);
  
  const position = async () => {
    await navigator.geolocation.getCurrentPosition(
      function (position) {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      function (err) {
        console.log(err);
      }
    );
  };
  
  const imageUploadHandler = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setUploadedImage(undefined);
      return;
    }
    setUploadedImage(e.target.files[0]);
  };
  
  useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);

    return () => {
      drop?.current?.removeEventListener("dragover", handleDragOver);
      drop?.current?.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleDragOver = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDrop = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    // this is required to convert FileList object to array
    if (ev.dataTransfer.items) {
      console.log(ev.dataTransfer.items);
      if (ev.dataTransfer.items["length"] === 1) {
        var file = ev.dataTransfer.items[0].getAsFile();
        if (file && file["type"].split("/")[0] !== "image") {
          return;
        }
        var image = URL.createObjectURL(file);
        setPreview(image);
        setIsPreview(true);
        return () => URL.revokeObjectURL(file);
      }
    }
  };
  
  const goBackHandler = () => {
    setSuccessData(false);
  };
  
  const submitForm = (e) => {
    e.preventDefault();
    if (preview === undefined) {
      return;
    }
    ref.current.continuousStart();

    var data = new FormData();

    data.append("image", imageUploaded);
    // NEW: Send the currently selected language to the backend
    data.append("lang", i18n.language || "en"); 
    
    axiosInstance
      .post("/dl/detection", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setSuccessData(response.data);
        ref.current.complete();
      })
      .catch((error) => {
        console.log(error);
        ref.current.complete();
      });
  };

  // --- PDF GENERATION FUNCTION ---
  const downloadPDF = () => {
    const element = document.getElementById("pdf-report");
    const cropName = successData.detection.split("__")[0];
    
    const opt = {
      margin:       10,
      filename:     `KisanSewak_${cropName}_Report.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#020617' }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };
  
  return (
    <>
      <LoadingBar color="#d9a441" ref={ref} height="3px" />
      {!successData && (
        <div className="md:grid md:grid-cols-2 place-items-center px-4 py-8">
          <div className="mt-5 md:mt-0 md:col-span-2 w-full max-w-5xl">
            <form action="#" method="POST" onSubmit={submitForm}>
              <div className="shadow-2xl shadow-slate-950/40 my-6 sm:rounded-3xl sm:overflow-hidden border border-amber-200/10 bg-slate-950/80 backdrop-blur-md">
                <div className="px-4 py-5 space-y-6 sm:p-6">
                  <div>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-slate-200"
                    >
                      {t("description.diseaseDetection.0")}
                    </label>
                    <div className="mt-1 flex justify-center">
                      {!isPreview && (
                        <img
                          src={default_crop}
                          className="p-2 bg-slate-900 border border-slate-700 rounded-2xl max-w-sm opacity-60 shadow-lg"
                          alt="Default"
                          required
                        ></img>
                      )}
                      {isPreview && (
                        <img
                          src={preview}
                          className="p-2 bg-slate-900 border border-amber-200/20 rounded-2xl max-w-sm shadow-lg"
                          alt="Preview"
                          required
                        ></img>
                      )}
                    </div>
                    {!isPreview && (
                      <label className="block text-sm font-medium text-amber-200">
                        {t("description.diseaseDetection.1")}
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200">
                      {t("description.diseaseDetection.2")}
                    </label>
                    <div
                      ref={drop}
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl border-amber-200/20 bg-slate-900/60"
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-amber-200/70"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="True"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-slate-300">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-amber-200 hover:text-amber-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-300"
                          >
                            <span>{t("description.diseaseDetection.3")}</span>
                            <input
                              id="file-upload"
                              onChange={imageUploadHandler}
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                            ></input>
                          </label>
                          <p className="pl-1">
                            {t("description.diseaseDetection.4")}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400">
                          PNG, JPG, GIF {t("description.diseaseDetection.5")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-md rounded-b-3xl text-slate-950 bg-gradient-to-r from-amber-300 to-orange-500 hover:brightness-110 font-extrabold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 w-full"
                >
                  <span>
                    {t("description.diseaseDetection.6")} &nbsp;
                    <BsSearch className="inline-block" />{" "}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {successData && (
        <div className="flex flex-col w-11/12 mx-auto mb-6 p-6">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden sm:rounded-3xl border border-amber-200/10 bg-slate-950/80 backdrop-blur-md shadow-2xl shadow-slate-950/40 p-4">
                
                {/* Button Container */}
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    className="inline-flex justify-center items-center py-2 px-4 shadow-sm text-md font-medium rounded-full text-slate-950 bg-gradient-to-r from-amber-300 to-orange-500 hover:brightness-110 focus:outline-none"
                    onClick={goBackHandler}
                  >
                    {t("description.diseaseDetection.7")} &nbsp; <IoReloadOutline size={20} />
                  </button>
                  
                  {/* NEW DOWNLOAD BUTTON */}
                  <button
                    type="button"
                    className="inline-flex justify-center items-center py-2 px-4 shadow-sm text-md font-medium rounded-full text-amber-100 bg-slate-800 hover:bg-slate-700 border border-slate-600 focus:outline-none"
                    onClick={downloadPDF}
                  >
                    {t("report.downloadPdf")} &nbsp; <BsDownload size={18} />
                  </button>
                </div>

                {/* PDF Content Wrapper */}
                <div id="pdf-report" className="p-4 bg-slate-950/90 rounded-2xl">
                  <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center border-b border-slate-700 pb-4">
                    {t("report.title")}
                  </h2>
                  <table className="min-w-full table-auto text-slate-100">
                    <tbody>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th
                          scope="col"
                          className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left"
                        >
                          {t("report.plantName")}
                        </th>
                        <td className="px-4">
                          {successData.detection.split("__")[0]}
                        </td>
                      </tr>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th
                          scope="col"
                          className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left"
                        >
                          {t("report.scientificName")}
                        </th>
                        <td className="px-4">
                          {successData.plant.scientificName}
                        </td>
                      </tr>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th
                          scope="col"
                          className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left"
                        >
                          {t("report.description")}
                        </th>
                        <td className="px-4">{successData.plant.description}</td>
                      </tr>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th
                          scope="col"
                          className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left"
                        >
                          {t("report.diseaseName")}
                        </th>
                        <td className="px-4">
                          {successData.detection
                            .split("__")[1]
                            .split("_")
                            .join(" ")}
                        </td>
                      </tr>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th
                          scope="col"
                          className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left"
                        >
                          {t("report.symptoms")}
                        </th>
                        <td className="px-4">{successData.disease.symptoms}</td>
                      </tr>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th
                          scope="col"
                          className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left"
                        >
                          {t("report.trigger")}
                        </th>
                        <td className="px-4">{successData.disease.trigger}</td>
                      </tr>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th
                          scope="col"
                          className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left"
                        >
                          {t("report.organic")}
                        </th>
                        <td className="px-4 py-3 text-slate-200" dangerouslySetInnerHTML={{ __html: successData.disease.organic }}></td>
                      </tr>
                      <tr className="bg-slate-900/80 border-b border-slate-700 hover:bg-slate-800/80">
                        <th scope="col" className="text-sm bg-slate-800 font-medium text-amber-100 px-6 py-4 text-left">
                            {t("report.chemical")}
                        </th>
                        <td className="px-4 py-3 text-slate-200" dangerouslySetInnerHTML={{ __html: successData.disease.chemical }}></td>
                      </tr>
                    </tbody>
                  </table>
                </div> {/* END OF PDF WRAPPER */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiseaseDetection;
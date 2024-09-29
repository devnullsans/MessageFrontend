import React from "react";
import $ from "jquery";
function Loader({ load }) {
  $("#spinneroverlay").fadeIn();

  $(document).ajaxStop(function () {
    $("#spinneroverlay").fadeOut();
  });
  return (
    <div>
      {load && (
        <div className="loaderParent">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default Loader;

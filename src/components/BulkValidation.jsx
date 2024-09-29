import React, { useState } from "react";
import TableComponent from "./TableComponent";

function BulkValidation({ correctValues, noDataMessage, columns }) {
  const [cid, setcid] = useState([]);

  return (
    <div>
      <div className="bulk-result mt-4 ">
        <div className="">
          <TableComponent
            checkbox={false}
            cid={cid}
            setcid={setcid}
            n={5}
            columns={columns}
            dataAll={correctValues}
            noDataMessage={noDataMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default BulkValidation;

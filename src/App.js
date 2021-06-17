import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [countries, setcountries] = useState("");
  const [sortedData, setsortedData] = useState("");
  const [sortby, setsortBy] = useState("");
  const calculateTotal = (data) => {
    let total = 0;

    total = data?.gold + data?.silver + data?.bronze;
    return total;
  };
  useEffect(() => {
    const call = async () => {
      let res = await axios.get(
        "https://s3.amazonaws.com/com.veea.medals/medals.json"
      );
      let flag = await axios.get(
        "https://s3.amazonaws.com/com.veea.medals/flags.png"
      );

      if (res.status == 200) {
        let withTotal = res.data.map((item, i) => {
          return { ...item, total: calculateTotal(item) };
        });

        setcountries(withTotal);
      }
    };

    call();
  }, []);

  const sort = (by) => {
    let sorteddata;
    if (sortby !== by) {
      sorteddata = [...countries].sort((a, b) => {
        if (a[by] > b[by]) return -1;
        return a[by] < b[by] ? 1 : 0;
      });
      setsortBy(by);
    } else {
      sorteddata = [...countries].sort((a, b) => {
        if (a[by] < b[by]) return -1;
        return a[by] > b[by] ? 1 : 0;
      });

      setsortBy("");
    }

    setsortedData(sorteddata);
  };
  useEffect(() => {
    if (countries) {
      sort("gold");
    }
  }, [countries]);

  return (
    <div className="App">
      {sortedData ? (
        <div>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th className="th-item" style={{ flex: 1, width: "40%" }}></th>
                <th
                  className="th-item"
                  onClick={() => {
                    sort("gold");
                  }}
                >
                  Gold
                </th>
                <th
                  className="th-item"
                  onClick={() => {
                    sort("silver");
                  }}
                >
                  Silver
                </th>
                <th
                  className="th-item"
                  onClick={() => {
                    sort("bronze");
                  }}
                >
                  Bronze
                </th>
                <th
                  className="th-item"
                  onClick={() => {
                    sort("total");
                  }}
                >
                  TOTAL
                </th>
              </tr>
            </tbody>

            <tbody>
              {sortedData.map((item, i) => {
                return (
                  <tr key={uuidv4()}>
                    <td className="td-item">
                      <div style={{ display: "flex" }}>
                        <span style={{ marginRight: "10px" }}>{i}</span>
                        <img
                          src={`https://www.countryflags.io/${item.code
                            .toLowerCase()
                            .slice(0, 2)}/flat/64.png`}
                          alt="..."
                          style={{ width: "20px", margin: "5px" }}
                        />

                        {item.code}
                      </div>
                    </td>

                    <td className="td-item">{item.gold}</td>
                    <td className="td-item">{item.silver}</td>
                    <td className="td-item">{item.bronze}</td>
                    <td className="td-item">{item.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No record</div>
      )}
    </div>
  );
}

export default App;

import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBorrows } from "../slices/BorrowSlice";

import borrow from "../borrow.css";  
export default function BorrowHistory() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const { list: history, loading } = useSelector((state) => state.borrow);
const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (userId) dispatch(fetchBorrows(Number(userId)));
  }, [dispatch, userId]);
const filteredHistory = history.filter((item) => {
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Returned" && item.isReturned) ||
      (filterStatus === "Borrowed" && !item.isReturned);

    const matchesSearch =
      item.bookTitle.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });
  if (loading) return <p>Loading borrow history...</p>;

  return (
  <div className="page-bg">
      <div className="history-container">
      <h2 className="page-title"> Your Borrow History</h2>
 <div className="filter-box">
          <div className="filter-tabs">
   {["All", "Returned", "Borrowed"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${filterStatus === tab ? "active" : ""}`}
                onClick={() => setFilterStatus(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          
          <input
            className="search-bar"
            type="text"
            placeholder="Search book name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      {loading ? (
          <p>Loading...</p>
        ) : filteredHistory.length === 0 ? (
          <p className="no-data">No borrowed books found.</p>
        ) :  (
        <table className="history-table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.borrowId}>
                <td>{item.bookTitle}</td>
                <td>{new Date(item.borrowDate).toLocaleDateString()}</td>
                <td>
                  {item.returnDate
                    ? new Date(item.returnDate).toLocaleDateString()
                    : "Not Returned"}
                </td>
                <td className={item.isReturned ? "status returned" : "status borrowed"}>{item.isReturned ? "Returned" : "Borrowed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}

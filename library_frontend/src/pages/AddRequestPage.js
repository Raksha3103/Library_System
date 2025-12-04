import React from "react";
import { useEffect } from "react";
import { useSelector , useDispatch} from "react-redux";
import { clearUserNotifications } from "../slices/RequestSlice";
import bookDetails from "../bookDetails.css";
import { fetchRequests } from "../slices/RequestSlice";

export default function AddRequestPage() {
  const { requests,notifications  } = useSelector((state) => state.requests);
  const userId = Number(localStorage.getItem("userId"));
const name= localStorage.getItem("name");
const dispatch=useDispatch();
  
  
  useEffect(() => {
  dispatch(fetchRequests());
}, []);
const myRequests = requests.filter((r) => r.userId === userId);

// useEffect(() => {
//     if (notifications.length > 0) {
//       const timer = setTimeout(() => {
//         dispatch(clearUserNotifications(userId));
//       }, 3000); 
//       return () => clearTimeout(timer);
//     }
//   }, [notifications, dispatch, userId]);
  return (
     <div className="page-bg">
      <div className="history-container">
      <h2 className="page-title">My Borrow/Return Requests</h2>

      {myRequests.length === 0 ? (
        <p className="no-data">You have not raised any requests yet.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Book Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map((req) => (
              <tr key={req.reqId}>
                <td>{req.bookTitle}</td>
                  <td>{req.type}</td>
                  <td
                    className={`status ${req.status === "Approved" ? "returned": req.status === "Rejected"? "borrowed": ""
                    }`}
                  >
                    {req.status}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}

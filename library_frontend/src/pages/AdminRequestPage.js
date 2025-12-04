import { useDispatch, useSelector } from "react-redux";
import { approveRequest, rejectRequest } from "../slices/RequestSlice";
import { bookBorrowed, bookReturned } from "../slices/BorrowSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminBorrows } from "../slices/BorrowSlice";
export default function AdminRequestsPage() {

  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.requests);
const navigate = useNavigate();
    const pendingRequests = requests.filter((r) => r.status === "Pending");
  const approveHandler = (req) => {
    
    // dispatch(approveRequest({ id: req.id }));
    dispatch(approveRequest(req));

    if (req.type === "Borrow") {
      dispatch(bookBorrowed({ bookId: req.bookId, userId: req.userId }));
    } else {
      dispatch(bookReturned({ bookId: req.bookId, userId: req.userId }));
    }
dispatch(fetchAdminBorrows());
  //  alert("Request Approved & Book Records Updated");
  };
  const rejectHandler = (req) => {
    //dispatch(rejectRequest({ id: req.id}));
    dispatch(rejectRequest(req));
  //  alert("Request Rejected");
  dispatch(fetchAdminBorrows());
  };

  useEffect(() => {
    if (pendingRequests.length === 0) {
      navigate("/books");
    }
  }, [pendingRequests, navigate]);

  if (pendingRequests.length === 0) {
    return null; 
  }


  return (
     <div className="page-bg">
      <div className="history-container">
      <h2 className="page-title">Pending Requests</h2>
   
            <table className="history-table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((req) => (
              <tr key={req.reqId}>
                <td>{req.bookTitle}</td>
                <td>{req.userId}</td>
               <td> {req.userName}</td>
                <td>{req.type}</td>
                <td>
                  <button
                    className="tab-btn"
                    onClick={() => approveHandler(req)}
                  >
                    Approve
                  </button>
                  <button
                    className="tab-btn"
                    onClick={() => rejectHandler(req)}
                   style={{ background: "#ff4d4f", color: "#fff", marginLeft: "5px" }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      
    </div>
    </div>
  );
}

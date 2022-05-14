// let pendingButton = document.getElementById('pending')
// let rejectButton = document.getElementById('reject')
// let acceptButton = document.getElementById('accept')
// let statusbody = document.getElementById('admin-status-tbody')

// const pendingData = (data, status) => {
//     let inc = 0
//     let dev = `<h1>none</h1>`
//     // data = JSON.stringify(data)
//     console.log(data, status)
//     console.log(data.length)
//     for (d of data) {
//         console.log(d)
//         if (d.status == status) {
//             console.log(data)
//             dev = `    
//                 <tr>
//                     <td>
//                         ${inc++}
//                     </td>
//                     <td>
//                         ${d.userName}
//                     </td>
//                     <td>
//                         ${d.city}
//                     </td>
//                     <td>
//                         ${d.theatreId}
//                     </td>
//                     <td>
//                         <ul class="action-list">
//                             <li><a href="/admin/status/accept/${d._id} "
//                                     data-tip="accept"><i class="fa fa-check fa-lg"></i></a>
//                             </li>
//                             <li><a href="/admin/status/reject/${d._id}" data-tip="reject"><i
//                                         class="fa fa-ban fa-lg px-2"></i></a>
//                             </li>
//                             <li><a href="/admin/status/view/${d._id}" data-tip="view"><i
//                                         class="fa fa-eye fa-lg "></i></a>
//                             </li>
//                         </ul>
//                     </td>
//                 </tr>

//             `

//         }
//     }
//     var z = document.createElement('tr'); // is a node
//     z.innerHTML = dev;
//     document.body.appendChild(z);

// }
// console.log("this from status")

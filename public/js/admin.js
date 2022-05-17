let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
    socket.emit("join", "adminRoom");
}

let adminOrders = document.querySelector("#admin-orders");

socket.on("orderPlaced", (result) => {
    const order = result.order;
    const name = result.name;
    const time = result.time;
    const date = result.date;
    const items = Object.values(result.order.item);
    function itemMarkup(items) {
        return items
            .map((item) => {
                return `<div>
                            <p>${item.item.name}</p>
                                <span>-</span>
                                <p>${item.qty}pcs</p>
                        </div>`;
            })
            .join("");
    }
    console.log(items);
    let tr = document.createElement("tr");
    tr.innerHTML = `
            <td>
                <div class="orders-col">
                    <p>
                        ${order._id}
                    </p>
                        ${itemMarkup(items)}
                </div>
            </td>
            <td>
                ${name}
            </td>
            <td>
                ${order.address}
            </td>
            <td class="status-col">
                <form class="status-form" action="/admin/orders/status/${order._id} " method="POST">
                    <select name="status" class="status" onchange="this.form.submit()">
                        <option value="Order placed" ${order.status === "Order Placed" ? "Selected" : ""} >
                            Order placed</option>
                        <option value="Order confirmed" ${order.status === "Order confirmed" ? "Selected" : ""}>
                            Order confirmed</option>
                        <option value="On the way" ${order.status === "On the way" ? "Selected" : ""}>On the way</option>
                        <option value="Out for delivery" ${
                            order.status === "Out for delivery" ? "Selected" : ""
                        } >Out for delivery
                        </option>
                        <option value="Completed" ${order.status === "Completed" ? "Selected" : ""}>Completed</option>
                    </select>
                </form>
            </td>
            <td>
                <p>
                    ${time}
                </p>
                <p>
                    ${date}
                </p>
            </td>
    `;
    adminOrders.prepend(tr);
});

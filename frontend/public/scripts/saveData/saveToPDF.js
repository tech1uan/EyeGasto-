import { fetchGetUserExpenses, getUserRecentExpenses } from "../data/expenses.js";

export async function saveDataToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("EyeGasto Data Report", 105, y, { align: "center" });
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Generated: " + new Date().toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric"
  }), 105, y, { align: "center" });
  doc.setTextColor(0);
  y += 10;

  function drawLine() {
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);
    y += 5;
  }

  function sectionTitle(title) {
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 20, y);
    y += 6;
    drawLine();
  }

  function checkPageBreak(neededSpace = 30) {
    if (y + neededSpace > 280) {
      doc.addPage();
      y = 20;
    }
  }

  function printTable(title, items) {
    sectionTitle(title);
    checkPageBreak();

    if (!items || items.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("No data available", 20, y);
      y += 10;
      return;
    }

    const total = items.reduce((sum, exp) => sum + (Number(exp.amount ?? exp.total ?? 0)), 0);

    const body = items.map((item, index) => [
      index + 1,
      item.date ?? "",
      item.description ?? "",
      item.category || item.type || "",
      "PHP " + Number(item.amount ?? item.total ?? 0).toFixed(2)
    ]);

    body.push(["", "", "", "Total:", "PHP " + total.toFixed(2)]);

    doc.autoTable({
      startY: y,
      head: [["#", "Date", "Description", "Category/Type", "Amount"]],
      body: body,
      theme: "grid",
      headStyles: { fillColor: [30, 144, 255], textColor: 255, fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 11, cellPadding: 3 },
      margin: { left: 15, right: 15 },
      didParseCell: (data) => {
        if (data.row.index === body.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 240, 255];
        }
      },
    });

    y = doc.lastAutoTable.finalY + 10;
  }


  const [todayExpenses, weekExpenses, allExpenses, recentExpenses] = await Promise.all([
    fetchGetUserExpenses('today'),
    fetchGetUserExpenses('last7'),
    fetchGetUserExpenses('alltime'),
    getUserRecentExpenses('alltime'),   
  ]);

  const safeToday   = Array.isArray(todayExpenses)  ? todayExpenses  : (todayExpenses?.expenses  ?? []);
  const safeWeek    = Array.isArray(weekExpenses)   ? weekExpenses   : (weekExpenses?.expenses   ?? []);
  const safeAll     = Array.isArray(allExpenses)    ? allExpenses    : (allExpenses?.expenses    ?? []);
  const safeRecent  = Array.isArray(recentExpenses) ? recentExpenses : (recentExpenses?.expenses ?? []);


  sectionTitle("Biggest Expense Today");

  const biggest = safeToday.length > 0
    ? safeToday.reduce((max, exp) => Number(exp.amount) > Number(max.amount) ? exp : max, safeToday[0])
    : null;

  if (!biggest) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("No expenses today.", 20, y);
    y += 10;
  } else {
    doc.autoTable({
      startY: y,
      head: [["Description", "Category", "Amount"]],
      body: [[
        biggest.description ?? "",
        biggest.category ?? "",
        "PHP " + Number(biggest.amount).toFixed(2)
      ]],
      theme: "grid",
      headStyles: { fillColor: [255, 140, 0], textColor: 255, fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 11, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }


  sectionTitle("Recent Expenses");

  if (safeRecent.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("No recent expenses.", 20, y);
    y += 10;
  } else {
    doc.autoTable({
      startY: y,
      head: [["Description", "Category", "Amount"]],
      body: safeRecent.map(exp => [
        exp.description ?? "",
        exp.category ?? "",
        "PHP " + Number(exp.amount).toFixed(2)
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 159, 159], textColor: 255, fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 11, cellPadding: 3 },
      margin: { left: 15, right: 15 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }


  sectionTitle("Expenses by Category");

  const grouped = safeAll.reduce((acc, exp) => {
    const key = exp.category || "Uncategorized";
    if (!acc[key]) acc[key] = { total: 0 };
    acc[key].total += Number(exp.amount ?? 0);
    return acc;
  }, {});

  const categoryKeys = Object.keys(grouped);

  if (categoryKeys.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("No category data available.", 20, y);
    y += 10;
  } else {
    const categoryTotal = categoryKeys.reduce((sum, key) => sum + grouped[key].total, 0);

    const categoryBody = categoryKeys.map((name, i) => {
      const amount = grouped[name].total;
      const percent = categoryTotal > 0 ? ((amount / categoryTotal) * 100).toFixed(1) : "0.0";
      return [i + 1, name, "PHP " + amount.toFixed(2), percent + "%"];
    });

    categoryBody.push(["", "Total", "PHP " + categoryTotal.toFixed(2), "100%"]);

    doc.autoTable({
      startY: y,
      head: [["#", "Category", "Amount", "% Share"]],
      body: categoryBody,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 200], textColor: 255, fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 11, cellPadding: 3 },
      margin: { left: 15, right: 15 },
      didParseCell: (data) => {
        if (data.row.index === categoryBody.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 230, 255];
        }
      },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  printTable("Today's Expenses", safeToday);
  printTable("Expenses This Week", safeWeek);
  printTable("All Expenses", safeAll);


  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
  }

  doc.save("GASTOO_Report.pdf");
}

export function initDLReportBtn() {
  const button = document.getElementById("export-data-btn");
  if (!button) {
    console.error("Download button not found");
    return;
  }

  button.addEventListener("click", (e) => {
    e.preventDefault();
    saveDataToPDF();   
  });
}
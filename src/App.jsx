import React, { useState, useRef } from "react";
import { Button, Input } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CourseForm = () => {
  const componentRef = useRef();

  const [formData, setFormData] = useState({
    courseCode: "",
    courseCategory: "",
    courseTitle: "",
    l: "",
    t: "",
    p: "",
    s: "",
    cr: "",
    ch: "",
    preRequisite: "",
    department: "",
    objectives: ["", "", "", "", "", ""],
    outcomes: Array(5).fill({ co: "", po: "", btl: "" }),
    matrix: Array(5).fill(Array(13).fill("")),
    syllabus: Array(5).fill(""),
    textbooks: ["", "", ""],
    references: ["", "", ""],
    moocs: ["", "", ""],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleOutcomeChange = (index, field, value) => {
    const updated = [...formData.outcomes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, outcomes: updated }));
  };

  const handleMatrixChange = (coIndex, poIndex, value) => {
    const newMatrix = formData.matrix.map((row, i) =>
      i === coIndex ? row.map((col, j) => (j === poIndex ? value : col)) : row
    );
    setFormData((prev) => ({ ...prev, matrix: newMatrix }));
  };

  const generatePDF = () => {
    const input = componentRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${formData.courseCode || "course_form"}.pdf`);
    });
  };

  const inputStyle = { height: "40px" };

  const sectionStyle = {
    pageBreakBefore: "always",
    marginTop: "80px",
  };

  const renderInput = (value, onChange, placeholder) => (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
    />
  );

  return (
    <div className="">
      <div
        className="no-print"
        style={{
          backgroundColor: "#f0f2f5", // Subtle dark gray
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/7/78/KL_University_logo.svg/1200px-KL_University_logo.svg.png"
            alt="Logo"
            style={{ height: 48 }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Course Plan - School of Computing
          </h1>
        </div>

        <Button
          type="primary"
          onClick={generatePDF}
          style={{ fontWeight: "bold" }}
        >
          Submit & Print
        </Button>
      </div>

      <div
        className="p-4"
        ref={componentRef}
        style={{
          maxWidth: 1200,
          margin: "auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* COURSE DETAILS */}
        <div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                COURSE CODE
              </label>
              {renderInput(
                formData.courseCode,
                (e) => handleChange("courseCode", e.target.value),
                "Course Code"
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                COURSE CATEGORY
              </label>
              {renderInput(
                formData.courseCategory,
                (e) => handleChange("courseCategory", e.target.value),
                "Course Category"
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                DEPARTMENT
              </label>
              {renderInput(
                formData.department,
                (e) => handleChange("department", e.target.value),
                "Department"
              )}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              COURSE TITLE
            </label>
            {renderInput(
              formData.courseTitle,
              (e) => handleChange("courseTitle", e.target.value),
              "Course Title"
            )}
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {["L", "T", "P", "S", "Cr", "CH"].map((label) => (
              <div style={{ flex: 1 }} key={label}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  {label}
                </label>
                {renderInput(
                  formData[label.toLowerCase()],
                  (e) => handleChange(label.toLowerCase(), e.target.value),
                  label
                )}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              PRE-REQUISITE COURSE(S)
            </label>
            {renderInput(
              formData.preRequisite,
              (e) => handleChange("preRequisite", e.target.value),
              "Pre-requisite Courses"
            )}
          </div>
        </div>

        {/* OBJECTIVES */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            COURSE OBJECTIVES
          </h3>
          {formData.objectives.map((val, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <strong>{i + 1}.</strong>
              {renderInput(
                val,
                (e) => handleArrayChange("objectives", i, e.target.value),
                `Objective ${i + 1}`
              )}
            </div>
          ))}
        </div>

        {/* OUTCOMES */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            COURSE OUTCOMES
          </h3>
          <table
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}
          >
            <thead>
              <tr>
                {["CO NO.", "COURSE OUTCOME (CO)", "PO/PSO", "BTL"].map(
                  (text, i) => (
                    <th
                      key={i}
                      style={{ border: "1px solid #000", padding: "8px" }}
                    >
                      {text}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {formData.outcomes.map((co, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    CO{i + 1}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {renderInput(
                      co.co,
                      (e) => handleOutcomeChange(i, "co", e.target.value),
                      ""
                    )}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {renderInput(
                      co.po,
                      (e) => handleOutcomeChange(i, "po", e.target.value),
                      ""
                    )}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {renderInput(
                      co.btl,
                      (e) => handleOutcomeChange(i, "btl", e.target.value),
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MATRIX */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            COURSE ARTICULATION MATRIX
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", padding: 4 }}></th>
                {[...Array(11)].map((_, i) => (
                  <th key={i} style={{ border: "1px solid #000", padding: 4 }}>
                    PO-{i + 1}
                  </th>
                ))}
                <th style={{ border: "1px solid #000", padding: 4 }}>PSO 1</th>
                <th style={{ border: "1px solid #000", padding: 4 }}>PSO 2</th>
              </tr>
            </thead>
            <tbody>
              {formData.matrix.map((row, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #000", padding: 4 }}>
                    CO{i + 1}
                  </td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{ border: "1px solid #000", padding: 4 }}
                    >
                      {renderInput(cell, (e) =>
                        handleMatrixChange(i, j, e.target.value)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SYLLABUS */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            SYLLABUS
          </h3>
          {formData.syllabus.map((val, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <strong>CO{i + 1}:</strong>
              {renderInput(
                val,
                (e) => handleArrayChange("syllabus", i, e.target.value),
                `Syllabus for CO-${i + 1}`
              )}
            </div>
          ))}
        </div>

        {/* TEXTBOOKS */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            TEXTBOOKS
          </h3>
          {formData.textbooks.map((val, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <strong>{i + 1}.</strong>
              {renderInput(
                val,
                (e) => handleArrayChange("textbooks", i, e.target.value),
                `Textbook ${i + 1}`
              )}
            </div>
          ))}
        </div>

        {/* REFERENCES */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            REFERENCE BOOKS
          </h3>
          {formData.references.map((val, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <strong>{i + 1}.</strong>
              {renderInput(
                val,
                (e) => handleArrayChange("references", i, e.target.value),
                `Reference Book ${i + 1}`
              )}
            </div>
          ))}
        </div>

        {/* MOOCS */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            MOOCs / WEB LINKS
          </h3>
          {formData.moocs.map((val, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <strong>{i + 1}.</strong>
              {renderInput(
                val,
                (e) => handleArrayChange("moocs", i, e.target.value),
                `MOOC/Link ${i + 1}`
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseForm;

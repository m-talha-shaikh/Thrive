import React, { useState } from 'react';
import './Resume.scss'
import { useForm } from 'react-hook-form';
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Resume = () => {
  const { register, handleSubmit } = useForm();
  const [pdfData, setPdfData] = useState(null);

  const onSubmit = (data) => {
    // Generate PDF with data
    const pdfContent = (
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <Text style={{ fontSize: '20px', textAlign: 'center'}} >{data.name}</Text>
          </View>
          <View style={{ margin: '10px auto', width: '70%',  display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} >
            <Text >{data.email}</Text>
            <Text >{data.phone}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Objective:</Text>
            <Text>{data.objective}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Education:</Text>
            <Text>{data.education}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Experience:</Text>
            <Text>{data.experience}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Skills:</Text>
            <Text>{data.skills}</Text>
          </View>
        </Page>
      </Document>
    );
    setPdfData(pdfContent);
  };

  const handleDownload = () => {
    // Generate PDF blob
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf';
    
    // Append anchor to body and trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="resume-form" style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div id="personal-resume">
                <label>Name:</label>
                <input type="text" {...register('name')} />

                <label>Email:</label>
                <input type="text" {...register('email')} />

                <label>Phone:</label>
                <input type="text" {...register('phone')} />
            </div>
          <label>Objective:</label>
          <input type="text" {...register('objective')} />
          
          <label>Education:</label>
          <input type="text" {...register('education')} />
          
          <label>Experience:</label>
          <input type="text" {...register('experience')} />
          
          <label>Skills:</label>
          <input type="text" {...register('skills')} />
          
          <button type="submit">Generate</button>
        </form>
      </div>

      <div style={{ flex: 1 }}>
        {pdfData ? (
          <>
            <PDFViewer style={{ width: '100%', height: '100vh' }}>{pdfData}</PDFViewer>
            <button onClick={handleDownload}>Download PDF</button>
          </>
        ) : (
          <p>Visualizer Placeholder</p>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Resume;

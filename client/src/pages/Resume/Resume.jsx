import React, { useState, useEffect, useContext } from 'react';
import './Resume.scss';
import { makeRequest } from '../../axios';
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { AuthContext } from "../../context/AuthContext";

const Resume = () => {
  const [pdfData, setPdfData] = useState(null);
  const [userData, setUserData] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    console.log(currentUser)
    makeRequest.get(`/persons/${currentUser.data.user.user_id}`)
      .then((response) => {
        setUserData(response.data);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [currentUser]);

  useEffect(() => {
    if (userData) {
      const pdfContent = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.name}>{userData.person.first_name} {userData.person.last_name}</Text>
              {/* <Text style={styles.contact}>{userData.person.email} | {userData.person.phone}</Text> */}
            </View>

            {/* Education Section */}
            {userData.education && (
              <View style={styles.section}>
                <Text style={styles.heading}>Education:</Text>
                {userData.education.map((edu) => (
                  <View key={edu.education_id}>
                    <Text style={styles.subheading}>{edu.name}</Text>
                    <Text style={[styles.section, { fontStyle: 'italic', fontSize: 13 }]}>{edu.major}</Text>
                    <Text style={[styles.section, { fontStyle: 'italic', fontSize: 9 }]}>{edu.year_enrolled} - {edu.year_graduated}</Text>
                    <Text style={styles.description}>{edu.text_description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Employment Section */}
            {userData.employment && (
              <View style={styles.section}>
                <Text style={styles.heading}>Experience:</Text>
                {userData.employment.map((emp) => (
                  <View key={emp.employment_id}>
                    <Text style={styles.subheading}>{emp.name}</Text>
                    <Text style={[styles.description, { fontStyle: 'italic', fontSize: 13 }]}>{emp.title}</Text>
                    <Text style={[styles.section, { fontStyle: 'italic', fontSize: 9 }]}>{emp.year_started} - {emp.year_left}</Text>
                    <Text style={styles.description}>{emp.text_description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certification Section */}
            {userData.certifications && (
              <View style={styles.section}>
                <Text style={styles.heading}>Certifications:</Text>
                {userData.certifications.map((cert) => (
                  <View key={cert.certification_id}>
                    <Text style={styles.subheading}>{cert.name}</Text>
                    <Text style={[styles.section, { fontStyle: 'italic', fontSize: 9 }]}>{cert.issuing_organization}</Text>
                    <Text style={[styles.section, { fontStyle: 'italic', fontSize: 9 }]}>{cert.issue_date.slice(0, 10)} - {cert.expiration_date ? cert.expiration_date.slice(0, 10) : 'Present'}</Text>
                    {/* Add more fields as needed */}
                  </View>
                ))}
              </View>
            )}
          </Page>
        </Document>
      );
      setPdfData(pdfContent);
    }
  }, [userData]);

  return (
    <div id="resume-container">
      {pdfData ? (
        <>
          <PDFViewer style={{ width: '100%', height: '100vh' }}>{pdfData}</PDFViewer>
        </>
      ) : (
        <p>Loading...</p>
      )}
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
    fontSize: 14,
    marginBottom: 5,
  },
  subheading: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 12,
    marginTop: 5,
  },
  name: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  contact: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Resume;

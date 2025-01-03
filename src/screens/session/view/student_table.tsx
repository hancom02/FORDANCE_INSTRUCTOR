import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import MyColor from '../../../constants/color';

const StudentTable = ({ studentList, isShort }: { studentList: IJoin[], isShort: boolean }) => {
    const displayedList = isShort ? studentList.slice(0, 3) : studentList;

    if (!Array.isArray(studentList)) {
        return null; 
    }

  return (
    <DataTable style={styles.table}>
      <DataTable.Header style={styles.header}>
        <DataTable.Title textStyle={styles.title} numberOfLines={2} style={{flex: 2}}>Student Name</DataTable.Title>
        <DataTable.Title textStyle={styles.title} style={{flex: 1}}>Progress</DataTable.Title>
        <DataTable.Title textStyle={styles.title} style={{flex: 1}}>Rating</DataTable.Title>
        <DataTable.Title textStyle={styles.title} style={{flex: 1}}>Feedback</DataTable.Title>
      </DataTable.Header>

      {displayedList.map((item, index) => (
        <DataTable.Row key={index}>
          <DataTable.Cell style={{flex: 2}} textStyle={styles.text_content}>{item.username}</DataTable.Cell>
          <DataTable.Cell>{item.progress + "%"}</DataTable.Cell>
          <DataTable.Cell>{item.rating}</DataTable.Cell>
          <DataTable.Cell>{item.review || item.review}</DataTable.Cell>
        </DataTable.Row>
      ))}
      {isShort && studentList.length >= 3 && 
        <DataTable.Row>
            <DataTable.Cell style={{flex: 2}} textStyle={styles.text_content}>...</DataTable.Cell>
            <DataTable.Cell>...</DataTable.Cell>
            <DataTable.Cell>...</DataTable.Cell>
            <DataTable.Cell>...</DataTable.Cell>
        </DataTable.Row>
      }
    </DataTable>
  );
};

const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: MyColor.gray, // Thay đổi màu viền theo ý muốn
        borderRadius: 5, // Tùy chọn: Làm tròn góc
      },
    header: {
        backgroundColor: MyColor.blue, // Thay đổi màu nền ở đây
      },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: MyColor.white,
    },
    text_content: {
        fontSize: 14,
        fontWeight: 'normal',
        color: MyColor.black,
    },
});

export default StudentTable;
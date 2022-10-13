import { Page, Text, View, Document, StyleSheet, Svg } from '@react-pdf/renderer';
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});
const QuestionPDF = ({ data }) => {
    return (
        <Document>
            {data.map((question, index) => {
                return (
                    <Page>
                        <View>
                            <Text>Question {index + 1}</Text>
                            <Text>
                                {question.question}
                            </Text>
                        </View>
                    </Page>
                )
            })}
            {/* <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #3</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #4</Text>
                </View>
            </Page> */}
        </Document>
    )
}

export default QuestionPDF
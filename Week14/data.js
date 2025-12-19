const data = {
    user: {
        name: "彭律瑋",
        role: "學生",
        avatar: "https://via.placeholder.com/150",
        id: "student123",
        email: "412630062@o365.tku.edu.tw",
        loginId: "412630062",
        accountType: "學生",
        department: "資管系 (日) 3C"
    },
    files: [
        {
            id: "F001",
            name: "smartwatch",
            type: "folder",
            date: "2025.11.04 23:58",
            size: "--",
            downloads: "--"
        },
        {
            id: "F002",
            name: "1141-412630062-彭律瑋-期末報告(21)...",
            type: "pdf",
            date: "2025.12.13 23:08",
            size: "1.66 MB",
            downloads: 1
        },
        {
            id: "F003",
            name: "P92_Demo1_TestFile(1).java",
            type: "code",
            date: "2025.12.11 17:01",
            size: "1.99 KB",
            downloads: 1
        },
        {
            id: "F004",
            name: "P92_EX1_TestFileChooser.java",
            type: "code",
            date: "2025.12.11 17:01",
            size: "738.00 B",
            downloads: 1
        },
        {
            id: "F005",
            name: "P93_Demo2_TestDirectory.java",
            type: "code",
            date: "2025.12.11 17:01",
            size: "1.17 KB",
            downloads: 1
        },
        {
            id: "F006",
            name: "P96_EX1_TextWriter.java",
            type: "code",
            date: "2025.12.11 17:01",
            size: "1.92 KB",
            downloads: 1
        },
        {
            id: "F007",
            name: "P99_Demo1_StreamTokenizer.java",
            type: "code",
            date: "2025.12.11 17:01",
            size: "980.00 B",
            downloads: 1
        }
    ],
    courses: [
        {
            id: "C001",
            title: "進階程式設計",
            code: "1141TLMXB3A2087 1C",
            department: "資管系 (日) 3 C",
            type: "必修",
            credits: 2.0,
            icon: "fas fa-code",
            color: "#0288d1",
            bg: "#e1f5fe",
            semester: "1141"
        },
        {
            id: "C002",
            title: "網路程式設計",
            code: "1141TLMXB3F1827 0C",
            department: "資管系 (日) 3 C",
            type: "必修",
            credits: 3.0,
            icon: "fas fa-project-diagram",
            color: "#e67e22",
            bg: "#fff3e0",
            semester: "1141"
        },
        {
            id: "C003",
            title: "系統分析與設計",
            code: "1141TLMXB3M0171 0C",
            department: "資管系 (日) 3 C",
            type: "必修",
            credits: 3.0,
            icon: "fas fa-sitemap",
            color: "#2ecc71",
            bg: "#e8f5e9",
            semester: "1141"
        },
        {
            id: "C004",
            title: "財務管理",
            code: "1141ILMXB3M0271 0C",
            department: "資管系 (日) 3 C",
            type: "必修",
            credits: 3.0,
            icon: "fas fa-calculator",
            color: "#f57c00",
            bg: "#fff3e0",
            semester: "1141"
        },
        {
            id: "C005",
            title: "資訊安全實務專題",
            code: "1141ILMXB3M0271 0C",
            department: "資管系 (日) 3 P",
            type: "必修",
            credits: 3.0,
            icon: "fas fa-shield-alt",
            color: "#388e3c",
            bg: "#e8f5e9",
            semester: "1141"
        }
    ],
    activities: [
        {
            id: "A001",
            type: "assignment_start",
            title: "作業發布",
            course: "網路程式設計",
            content: "作業 1215 已開始",
            time: "2025.12.15 10:39",
            icon: "fas fa-book-open",
            iconColor: "icon-blue"
        },
        {
            id: "A002",
            type: "deadline_soon",
            title: "學習活動即將截止",
            course: "網路程式設計",
            content: "作業 1215 即將於 2025-12-15 23:59 截止",
            time: "2025.12.15 10:39",
            icon: "fas fa-exclamation-triangle",
            iconColor: "icon-orange"
        },
        {
            id: "A003",
            type: "grade",
            title: "作業成績",
            course: "進階程式設計",
            content: "你在 課程 進階程式設計 的作業 M13C_1002_Hwk3 獲得了 90.0 分的成績",
            time: "2025.12.14 21:13",
            icon: "fas fa-check-circle",
            iconColor: "icon-green"
        }
    ],
    bulletins: [
        {
            id: "B001",
            title: "1/5 提前demo的組別注意事項",
            course: "企業雲端應用...",
            date: "2025.12.04 16:00",
            updateDate: "2025.12.08 11:44",
            target: "所有人",
            isNew: true,
            isImportant: false
        },
        {
            id: "B002",
            title: "[重要] 期末分組報告注意事項",
            course: "企業雲端應用...",
            date: "2025.12.02 15:54",
            updateDate: "2025.12.08 11:43",
            target: "所有人",
            isNew: true,
            isImportant: true,
            content: "期末分組報告重要說明，請仔細閱讀"
        },
        {
            id: "B003",
            title: "本課程停課公告 12月8日(一)、月9日(二)",
            course: "網路程式設計",
            date: "2025.12.07 21:05",
            target: "所有人",
            isNew: false,
            isImportant: false
        }
    ],
    todos: [
        {
            id: "T001",
            title: "1215 作業",
            deadline: "2025.12.15 23:59",
            status: "待繳交"
        },
        {
            id: "T002",
            title: "Week12_Lab 作業",
            deadline: "2025.12.19 23:59",
            status: "待繳交"
        }
    ]
};

module.exports = data;

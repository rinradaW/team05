package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

//จริงๆ ครับ จริงๆ ของจริงสุดๆ
func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	v := true
	database, err := gorm.Open(sqlite.Open("schema.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	database.AutoMigrate(
		&Customer{},
		&RepairType{},
		&Urgency{},
		&RepairRequest{},
		&Employee{},
		&WorkPlace{},
		&WorkReceive{},
		&PaidBy{},
		&RecieptHistory{},
		&PurchasingCompany{},
		&PartsPurchase{},
		&Difficulty{},
		&RepairHistory{},
		&Warrantee{},
		&WarranteeType{},
	)

	db = database
	password, err := bcrypt.GenerateFromPassword([]byte("232345"), 14)

	//Employee Data

	Employee1 := Employee{
		Name:        "Rinrada Wattan",
		Age:         21,
		Email:       "rinrada_lady27@outlook.com",
		PhoneNumber: "0985855271",
		Password:    string(password),
	}
	db.Model(&Employee{}).Create(&Employee1)

	Employee2 := Employee{
		Name:        "Bunyarith Sukmongkhon",
		Age:         18,
		Email:       "eoozassqq@hotmail.com",
		PhoneNumber: "0635166895",
		Password:    string(password),
	}
	db.Model(&Employee{}).Create(&Employee2)

	Employee3 := Employee{
		Name:        "Prayut Pumipon",
		Age:         59,
		Email:       "Prayutguys@hotmail.com",
		PhoneNumber: "0833794989",
		Password:    string(password),
	}
	db.Model(&Employee{}).Create(&Employee3)

	var em1 Employee
	var em2 Employee
	var em3 Employee
	db.Raw("Select * from employees where email = ?", "eoozassqq@hotmail.com").Scan((&em1))
	db.Raw("Select * from employees where email = ?", "bunyarith@hotmail.com").Scan((&em2))
	db.Raw("SELECT * FROM employees WHERE email = ?", "rinrada_lady27@outlook.com").Scan(&em3)

	//Customer Data

	db.Model(&Customer{}).Create(&Customer{
		Name:        "RinRin",
		ID_Customer: "rinrin123",
		Password:    string(password),
	})
	db.Model(&Customer{}).Create(&Customer{
		Name:        "Dada",
		ID_Customer: "dada123",
		Password:    string(password),
	})
	software := RepairType{
		Name: "software",
	}
	db.Model(&RepairType{}).Create(&software)
	hardware := RepairType{
		Name: "hardware",
	}
	db.Model(&RepairType{}).Create(&hardware)
	softwareandhardware := RepairType{
		Name: "software and hardware",
	}
	db.Model(&RepairType{}).Create(&softwareandhardware)
	other := RepairType{
		Name: "other",
	}
	db.Model(&RepairType{}).Create(&other)
	nonurgency := Urgency{
		Name: "nonurgency",
	}
	db.Model(&Urgency{}).Create(&nonurgency)
	semiurgency := Urgency{
		Name: "semi-urgency",
	}
	db.Model(&Urgency{}).Create(&semiurgency)
	urgency := Urgency{
		Name: "urgency",
	}
	db.Model(&Urgency{}).Create(&urgency)
	//Difficulty Data
	easy := Difficulty{
		Name: "easy",
	}
	db.Model(&Difficulty{}).Create(&easy)

	average := Difficulty{
		Name: "average",
	}
	db.Model(&Difficulty{}).Create(&average)

	hard := Difficulty{
		Name: "hard",
	}
	db.Model(&Difficulty{}).Create(&hard)

	none := Difficulty{
		Name: "none",
	}
	db.Model(&Difficulty{}).Create(&none)

	//RepairRequest Data
	RR001 := RepairRequest{
		Device:      "Acer Computer",
		Lifetime:    3,
		Issue:       "คอมพิวเตอร์เปิดไม่ติด",
		RequestDate: time.Date(2021, 12, 27, 9, 18, 00, 000, time.UTC),
	}
	db.Model(&RepairRequest{}).Create(&RR001)

	RR002 := RepairRequest{
		Device:      "Brother CPx703 Printer",
		Lifetime:    1,
		Issue:       "Printer ถ่ายเอกสาร แล้วตัวอักษรเพี้ยน",
		RequestDate: time.Date(2021, 12, 30, 15, 40, 55, 000, time.UTC),
	}
	db.Model(&RepairRequest{}).Create(&RR002)

	//RepairHistory
	db.Model(&RepairHistory{}).Create(&RepairHistory{
		Problem:       "Powersupplyเสีย ต้องเปลี่ยนทดแทนของใหม่",
		Solution:      "เบิก Powersupply เปลี่ยน 1 ตัว",
		Success:       &v,
		Timestamp:     time.Date(2021, 12, 20, 17, 30, 00, 000, time.UTC),
		RepairRequest: RR001,
		Difficulty:    easy,
		Editor:        em1,
	})

	db.Model(&RepairHistory{}).Create(&RepairHistory{
		Problem:       "ตัวสแกนและสายแพรชำรุด",
		Solution:      "เปลี่ยนเซ็นเซอร์ใช้สแกน และเปลี่ยนสายแพรใหม่",
		Success:       &v,
		Timestamp:     time.Date(2022, 01, 07, 10, 55, 37, 000, time.UTC),
		RepairRequest: RR002,
		Difficulty:    average,
		Editor:        em1,
	})

	workplace1 := WorkPlace{
		Name: "On site",
	}
	db.Model(&WorkPlace{}).Create(&workplace1)
	workplace2 := WorkPlace{
		Name: "Off site",
	}
	db.Model(&WorkPlace{}).Create(&workplace2)
	workplace3 := WorkPlace{
		Name: "Remote",
	}
	db.Model(&WorkPlace{}).Create(&workplace3)

	rwork1 := RepairRequest{
		Device:      "ACER",
		Lifetime:    1,
		Issue:       "Don't Know",
		RequestDate: time.Now(),
	}
	db.Model(&RepairRequest{}).Create(&rwork1)
	rwork2 := RepairRequest{
		Device:      "ACER2",
		Lifetime:    1,
		Issue:       "Don't Know",
		RequestDate: time.Now(),
	}
	db.Model(&RepairRequest{}).Create(&rwork2)
	rwork3 := RepairRequest{
		Device:      "ACER3",
		Lifetime:    1,
		Issue:       "Don't Know",
		RequestDate: time.Now(),
	}
	db.Model(&RepairRequest{}).Create(&rwork3)
	rwork4 := RepairRequest{
		Device:      "ACER4",
		Lifetime:    1,
		Issue:       "Don't Know",
		RequestDate: time.Now(),
	}
	db.Model(&RepairRequest{}).Create(&rwork4)
	workrecive1 := WorkReceive{
		FinishedDate: time.Date(2022, 05, 01, 00, 00, 00, 000, time.UTC),
		Wages:        120,
		WorkCode:     "W1234",

		WorkPlace:     workplace1,
		Employee:      Employee3,
		RepairRequest: rwork1,
	}
	db.Model(&WorkReceive{}).Create(&workrecive1)

	//WorkRecieveData

	work1 := WorkReceive{
		WorkCode:     "W6789",
		Wages:        50.50,
		FinishedDate: time.Now(),
		Employee:     Employee1,
	}
	db.Model(&WorkReceive{}).Create(&work1)

	work2 := WorkReceive{
		WorkCode:     "W2525",
		Wages:        100.25,
		FinishedDate: time.Now(),
		Employee:     Employee2,
	}
	db.Model(&WorkReceive{}).Create(&work2)

	//RecieptHistory
	pay1 := PaidBy{
		Name: "banking",
	}
	db.Model(&PaidBy{}).Create(&pay1)

	pay2 := PaidBy{
		Name: "prompay",
	}
	db.Model(&PaidBy{}).Create(&pay2)

	reciept1 := RecieptHistory{
		RecieptCode:  "R1234",
		RecieptPrice: 1000.50,
		RecieptDate:  time.Now(),
		Employee:     Employee1,
		WorkReceive:  work1,
		PaidBy:       pay1,
	}
	db.Model(&RecieptHistory{}).Create(&reciept1)

	reciept2 := RecieptHistory{
		RecieptCode:  "R4321",
		RecieptPrice: 5000.25,
		RecieptDate:  time.Now(),
		Employee:     Employee2,
		WorkReceive:  work2,
		PaidBy:       pay2,
	}
	db.Model(&RecieptHistory{}).Create(&reciept2)
}

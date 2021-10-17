const pool = require('./utils/pool')

async function selectSimple() {
    let params = [1]
    let [rows, fields] = await pool.query(/*sql*/`select * from animal where animal_id > ?`, params)
    console.log(rows)
}

async function insertWithoutTransaction() {
    let params = ['테스트유저']
    await pool.query(/*sql*/`insert into user (nickname) values (?)`, params)
}

async function insertWithTransaction(simulateError) {
    let conn = await pool.getConnection()   // pool 에서 connection 하나 가져오기.
    try {
        await conn.beginTransaction()
        await conn.query(/*sql*/`insert into user (nickname) values (?)`, ['TestUser1'])
        await conn.query(/*sql*/`insert into user (nickname) values (?)`, ['TestUser2'])
        if (simulateError) throw new Error('이 에러가 있으니 롤백이 되어야 함.')
        await conn.commit()
    } catch (e) {
        console.error('Error occurred', e)
        console.log('Rollback transaction')
        await conn.rollback()
    } finally {
        console.log('Releasing connection to the pool')
        await conn.release()    // 가져온 커넥션 반환하기. (필수)
    }
}

selectSimple()  // 간단 select

insertWithoutTransaction() // Transaction 없이 insert 처리. (auto-commit)

// 아래의 인자를 true로 하면 오류가 발생하고 rollback 되는 상황을 시뮬레이션 할 수 있음.
insertWithTransaction(true)  // Transaction 제어 insert 처리.

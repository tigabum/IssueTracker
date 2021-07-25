const databasefile = require('./database');
const { ApolloServer, UserInputError } = require('apollo-server-express');

let db;
const{getNextSequence, getDatabase} = databasefile;


async function Select(_, {id}){
    db = getDatabase();
    const issue = db.collection('issues').findOne({id});
    return issue;

}

async function List(_, {status, effortMin, effortMax}){
    db = getDatabase();
    const filter = {};
    if(status)filter.status = status;
    if(effortMin !== undefined || effortMax !== undefined ){
        filter.effort = {}
   
    if(effortMin !==undefined )filter.effort.$gte = effortMin;
    if(effortMax !== undefined )filter.effort.$lte = effortMax;
     }

    const issues = await db.collection('issues').find(filter).toArray();
    return issues;
}

function validateIssue({title, status, owner}){
 const errors = [];
//  console.log(title? 'ale':'yelem' );
// console.log('passed validation')
if (title.length < 3) {
errors.push('Field "title" must be at least 3 characters long.')
}
if (status == 'Assigned' && !owner) {
errors.push('Field "owner" is required when status is "Assigned"');
}
if (errors.length > 0) {
throw new UserInputError('Invalid input(s)', { errors });
}
}

async function Add(_, {issue}){ 
        // const title = issue.title;
    validateIssue(issue);
    // console.log(issue.title);
    // console.log(issue);

    issue.created = new Date();
    // issue.id = standindb.length + 1;
    issue.id = await getNextSequence('issues');
    // if(issue.status==undefined) issue.status = 'New';
    // standindb.push(issue);
    db = getDatabase();
    const result = await db.collection('issues').insertOne(issue);
    const savedIssue = await db.collection('issues')
                       .findOne({_id:result.insertedId});
    return savedIssue;

}

async function Update(_,{id, changes}){
                    db = getDatabase();
                    if(changes.title || changes.status || changes.owner){
                        const issue = await db.collection('issues').findOne({id});
                        Object.assign(issue, changes);
                        validateIssue(issue);
                    }
                    await db.collection('issues').updateOne({id}, {$set: changes});
                    const issueUpadated = await db.collection('issues').findOne({id});
                    return issueUpadated;

}

async function remove(_, { id }) {
            const db = getDatabase();
            const issue = await db.collection('issues').findOne({ id });
            if (!issue) return false;
            issue.deleted = new Date();
            let result = await db.collection('deleted_issues').insertOne(issue);
            if (result.insertedId) {
            result = await db.collection('issues').removeOne({ id });
            return result.deletedCount === 1;
            }
            return false;
            }

module.exports = {List, Add, Select, Update, Delete:remove}
const about = require('./about')
const GraphQLDate = require('./graphqldate.js');
const {ApolloServer, UserInputError} = require('apollo-server-express');
const fs = require('fs');
const issue = require('./issue')


const resolvers ={
    Query:{
        about: about.getAboutMessage,
        issueList:issue.List,
        issue:issue.Select,

    },
    Mutation:{
        setAboutMessage:about.setAboutMessage,
         issueAdd: issue.Add,
         issueUpdate:issue.Update,
         issueDelete:issue.Delete
       

    },
    GraphQLDate,
};

const server = new ApolloServer({
    typeDefs:fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
console.log(error);
return error;
},   
})
function installHandler(app){
    const enableCors = (process.env.ENABLE_CORS || 'true') == 'true';
console.log('Cors setting:', enableCors);
server.applyMiddleware({app, path:'/graphql',cors:enableCors });

}
module.exports = installHandler;

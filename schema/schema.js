const graphql = require("graphql");
const R = require("ramda");
const User = require("../models/user");
const Msg = require("../models/msg");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const MsgType = new GraphQLObjectType({
  name: "Msg",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    // fromUser:{type: GraphQLString},
    userId: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return R.find(R.propEq("id", parent.userId))(users);
        return User.findById(parent.userId);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    msgs: {
      type: new GraphQLList(MsgType),
      resolve(parent, args) {
        // return R.filter(R.propEq("userId", parent.id))(msgs);
        return Msg.find({ userId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    msg: {
      type: MsgType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db
        // return R.find(R.propEq("id", args.id))(msgs);
        return Msg.findById(args.id);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return R.find(R.propEq("id", args.id))(users);
        return User.findById(args.id);
      }
    },
    msgs: {
      type: new GraphQLList(MsgType),
      resolve(parent, args) {
        // return msgs;
        return Msg.find({}); //find all
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        // return users;
        return User.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const user = new User({
          name: args.name
        });
        return user.save();
      }
    },
    addMsg: {
      type: MsgType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const msg = new Msg({
          userId: args.userId,
          content: args.content
        });
        return msg.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

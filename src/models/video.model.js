import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //it's basically group up the queries and then paginate the results for example get me all the videos where views > 1000 and then paginate the results
const videoSchema= new Schema(
    {
        videFile: {
            type: String, //cloudinary url
            required: true,
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, // in seconds
            required: true,
    },
    views: {
        type: Number,
        default: 0,
},
     isPublished: {
        type: Boolean,
        default: true,
     },
     owner: {
        type: Schema.Types.ObjectId, // Reference to User model
        ref: "User",
        required: true,
     },
    },
    {
        timestamps: true,
    }
)
videoSchema.plugin(mongooseAggregatePaginate);
export const Video= mongoose.model("Video", videoSchema);
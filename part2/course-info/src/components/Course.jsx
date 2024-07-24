function Course({name, parts}) {
    return ( <>
    <h1>{name}</h1>
    {parts.map(p => <p key={p.id}>{p.name} {p.exercises}</p>)}
    <p><b>Total of {parts.reduce((acc, p) => acc + p.exercises, 0)} exercises</b></p>
    </> );
}

export default Course;
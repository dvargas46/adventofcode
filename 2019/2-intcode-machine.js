const runIntCode = (intcode) => {
    let result = [...intcode];
    const opcodes_size = Math.floor(intcode.length / 4);
    
    main:
    for (let i=0; i<opcodes_size; i++) {
        const rel_pos = i*4;
        opcode = result[rel_pos];
        switch (opcode) {
            case 1: {
                result[result[rel_pos+3]] = result[result[rel_pos+1]] + result[result[rel_pos+2]];
                break;
            }
            case 2: {
                result[result[rel_pos+3]] = result[result[rel_pos+1]] * result[result[rel_pos+2]];
                break;
            }
            case 99:
            default:
                break main;
    
        }
    }

    return result;
};

module.exports = {
    'run': runIntCode
};
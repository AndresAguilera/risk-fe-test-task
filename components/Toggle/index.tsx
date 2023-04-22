import React, { ChangeEventHandler } from 'react'

interface ToggleProps {
    isOn: boolean
    handleToggle: ChangeEventHandler<HTMLInputElement>
}

const Toggle = ({ isOn, handleToggle }: ToggleProps) => {
    return (
        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
            <input
                type="checkbox"
                name="toggle"
                id="toggle"
                checked={isOn}
                onChange={handleToggle}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none "
            />
            <label
                htmlFor="toggle"
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            >
                <span
                    className={`block w-1/2 h-full rounded-full ${
                        isOn ? 'bg-blue-500' : 'bg-white'
                    } transition-transform duration-200 ease-in transform ${
                        isOn ? 'translate-x-full' : 'translate-x-0'
                    }`}
                ></span>
            </label>
        </div>
    )
}

export default Toggle
